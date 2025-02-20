import {
  defaultDetokenizer,
  DetokenizingEmitter,
  flattenTree,
  type TokenTree,
} from "../../common/Language";
import { joinTrees } from "../../common/emit";
import {
  block,
  type Node,
  type IR,
  isInt,
  text,
  toString,
  variants,
  type Variants,
  opCodeDefinitions,
  type OpCode,
  isOpCode,
  isNullary,
  isOp,
} from "../../IR";
import { infixableOpCodeNames } from "../../frontend/lexer";
import { withDefaults } from "../../plugins/ops";

/*
How Polygolf nodes should be emitted to strings.

Boolean flags should be reflected in the callee name.
All paramaters that are not `Node`s should be listed first.
- strings as Texts
- numbers/bigints as Integers
- arrays as blocks
Then, all Node children should follow in order that is typical in languages.
If the last child is an array of Nodes argument, it should be emitted as individual arguments,
instead of as a block.
*/

export class PolygolfEmitter extends DetokenizingEmitter {
  detokenize = defaultDetokenizer(
    (a, b) =>
      a !== "(" &&
      b !== ")" &&
      b !== ";" &&
      b !== ":" &&
      a !== ":" &&
      a !== "\n" &&
      b !== "\n",
    2,
  );

  emitTokens(program: IR.Node) {
    return flattenTree(emitNode(program, true));
  }
}

function emitVariants(expr: Variants, indent = false): TokenTree {
  if (indent || expr.variants.some((x) => x.kind === "Block")) {
    return [
      "{",
      "$INDENT$",
      "\n",
      joinTrees(
        ["$DEDENT$", "\n", "/", "$INDENT$", "\n"],
        expr.variants.map((x) => emitNode(x, true)),
      ),
      "$DEDENT$",
      "\n",
      "}",
    ];
  }
  return [
    "{",
    joinTrees(
      "/",
      expr.variants.map((x) => emitNode(x, true)),
    ),
    "}",
  ];
}

export function emitArrayOfNodes(exprs: readonly Node[]) {
  return [
    "{",
    joinTrees(
      [],
      exprs.map((x) => emitNode(x, true)),
    ),
    "}",
  ];
}

export function emitNode(
  expr: Node,
  asStatement = false,
  indent = false,
): TokenTree {
  let res = emitNodeWithoutAnnotation(expr, asStatement, indent);
  if (asStatement) {
    if (expr.kind !== "Block") res = [res, ";"];
  } else {
    if (expr.type !== undefined) {
      res = [res, ":", toString(expr.type)];
    }
    if (expr.targetType !== undefined) {
      res = [res, ":", JSON.stringify(expr.targetType)];
    }
  }
  return res;
}

export function emitNodeWithoutAnnotation(
  expr: Node,
  asStatement = false,
  indent = false,
): TokenTree {
  function emitSexpr(
    op: string | null,
    ...args: (TokenTree | Node)[]
  ): TokenTree {
    let nullary = false;
    if (op === null) {
      op = expr.kind;
      op = op
        .split(/\.?(?=[A-Z])/)
        .join("_")
        .toLowerCase();
    } else {
      if (isOpCode(op)) {
        nullary = isNullary(op);
        if (
          "front" in opCodeDefinitions[op as OpCode] &&
          typeof (opCodeDefinitions[op as OpCode] as any).front === "string"
        )
          op = (opCodeDefinitions[op as OpCode] as any).front;
      }
    }

    const result: TokenTree = [];
    if (!asStatement && !nullary) result.push("(");
    if (indent) result.push("$INDENT$", "\n");

    if (
      (op === "<-" ||
        op === "=>" ||
        infixableOpCodeNames.includes(op as any)) &&
      args.length === 2
    ) {
      let a = args[0];
      result.push(typeof a === "string" || !("kind" in a) ? a : emitNode(a));
      result.push(op!);
      a = args[1];
      result.push(typeof a === "string" || !("kind" in a) ? a : emitNode(a));
    } else {
      result.push(op!);
      result.push(
        joinTrees(
          [],
          args.map((x) =>
            typeof x === "string" || !("kind" in x) ? [x] : emitNode(x),
          ),
        ),
      );
    }
    if (!asStatement) {
      if (indent) result.push("$DEDENT$", "\n");
      if (!nullary) result.push(")");
    }
    return result;
  }
  switch (expr.kind) {
    case "Block":
      return joinTrees(
        "\n",
        expr.children.map((x) => emitNode(x, true)),
      );
    case "Variants":
      return emitVariants(expr, indent);
    case "KeyValue":
      return emitSexpr("=>", expr.key, expr.value);
    case "Function":
      return emitSexpr("func", ...expr.args, expr.expr);
    case "Op":
      return emitSexpr(
        expr.op,
        ...withDefaults(null).preprocess(expr.args, expr.op),
      );
    case "Assignment":
      return emitSexpr("<-", expr.variable, expr.expr);
    case "FunctionCall": {
      const id = emitNode(expr.func);
      if (typeof id === "string" && id.startsWith("$")) {
        return emitSexpr(id, ...expr.args);
      }
      return emitSexpr(null, id, ...expr.args);
    }
    case "Identifier":
      if (expr.builtin) {
        return emitSexpr("builtin", text(expr.name));
      } else if (/^\w+$/.test(expr.name)) {
        return "$" + expr.name;
      }
      return emitSexpr("id", text(expr.name));
    case "Text":
      return JSON.stringify(expr.value);
    case "Integer":
      return expr.value.toString();
    case "Array":
      return emitSexpr("array", ...expr.value);
    case "List":
      return emitSexpr("list", ...expr.value);
    case "Set":
      return emitSexpr("set", ...expr.value);
    case "Table":
      return emitSexpr("table", ...expr.value);
    case "ConditionalOp":
      return emitSexpr(
        expr.isSafe ? "conditional" : "unsafe_conditional",
        expr.condition,
        expr.consequent,
        expr.alternate,
      );
    case "While":
      return emitSexpr(
        "while",
        expr.condition,
        emitNode(expr.body, false, true),
      );
    case "ForArgv":
      return emitSexpr(
        "for_argv",
        expr.variable,
        expr.argcUpperBound.toString(),
        emitNode(expr.body, false, true),
      );
    case "If":
      return emitSexpr(
        "if",
        expr.condition,
        emitNode(expr.consequent, false, true),
        ...(expr.alternate === undefined
          ? []
          : emitNode(expr.alternate, false, true)),
      );

    case "Cast":
      return emitSexpr(null, expr.expr);
    case "ImplicitConversion":
      return emitSexpr(null, text(expr.behavesLike), expr.expr);
    case "VarDeclaration":
      return emitSexpr(null, { ...expr.variable, type: expr.variableType });
    case "VarDeclarationWithAssignment":
      return emitSexpr(null, expr.assignment);
    case "VarDeclarationBlock":
      return emitSexpr(null, ...expr.children.map((x) => emitNode(x)));
    case "ManyToManyAssignment":
      return emitSexpr(
        null,
        emitArrayOfNodes(expr.variables),
        emitArrayOfNodes(expr.exprs),
      );
    case "OneToManyAssignment":
      return emitSexpr(null, variants([block(expr.variables)]), expr.expr);
    case "IndexCall":
      return emitSexpr(null, expr.collection, expr.index);
    case "RangeIndexCall":
      return emitSexpr(null, expr.collection, expr.low, expr.high, expr.step);
    case "MethodCall":
      return emitSexpr(null, expr.object, text(expr.ident.name), ...expr.args);
    case "PropertyCall":
      return emitSexpr(null, expr.object, text(expr.ident.name));
    case "Infix":
      return emitSexpr(null, text(expr.name), expr.left, expr.right);
    case "Prefix":
    case "Postfix":
      return emitSexpr(null, text(expr.name), expr.arg);
    case "Import":
      return emitSexpr(
        null,
        ...[expr.name, ...expr.modules].map((x) => JSON.stringify(x)),
      );
    case "ForEach":
      if (isOp("range_excl")(expr.collection)) {
        const [low, high, step] = expr.collection.args;
        if (isInt(0n)(low) && isInt(1n)(step)) {
          if (expr.variable === undefined) {
            return emitSexpr("for", high, emitNode(expr.body, false, true));
          }
          return emitSexpr(
            "for",
            expr.variable,
            high,
            emitNode(expr.body, false, true),
          );
        }
      } else if (
        isOp(
          "text_to_list[Ascii]",
          "text_to_list[byte]",
          "text_to_list[codepoint]",
        )(expr.collection)
      ) {
        return emitSexpr(
          expr.collection.op
            .replace("text_to_list", "for")
            .replace("[Ascii]", ""),
          expr.variable ?? "_",
          expr.collection.args[0],
          emitNode(expr.body, false, true),
        );
      }
      return emitSexpr(
        "for",
        expr.variable ?? "_",
        expr.collection,
        emitNode(expr.body, false, true),
      );
    case "ForCLike":
      return emitSexpr(
        null,
        expr.init,
        expr.condition,
        expr.append,
        emitNode(expr.body, false, true),
      );
    case "NamedArg":
      return emitSexpr(null, text(expr.name), expr.value);
    case "AnyInteger":
      return emitSexpr(null, expr.low.toString(), expr.high.toString());
  }
}
