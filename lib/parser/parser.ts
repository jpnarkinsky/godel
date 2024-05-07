import { createToken, Lexer, CstParser, Rule } from "chevrotain";

const Identifier = createToken({name: "Identifier", pattern: /[a-z0-9A-Z]+/});
const True = createToken({ name: "True", pattern: /true/ });
const False = createToken({ name: "False", pattern: /false/ });
const Null = createToken({ name: "Null", pattern: /null/ });
const LCurly = createToken({ name: "LCurly", pattern: /{/ });
const RCurly = createToken({ name: "RCurly", pattern: /}/ });
const LSquare = createToken({ name: "LSquare", pattern: /\[/ });
const StatementSeparator = createToken({ name: "StatementSeparator", pattern: /([\n\r;]+\s?)+/});
const RSquare = createToken({ name: "RSquare", pattern: /]/ });
const Comma = createToken({ name: "Comma", pattern: /,/ });
const Colon = createToken({ name: "Colon", pattern: /:/ });
const Equal = createToken({ name: "Equal", pattern: /=/ });
const InitializeOperator = createToken({ name: "InitializeOperator", pattern: /:=/ });

const StringLiteral = createToken({
  name: "StringLiteral",
  pattern: /"(:?[^\\"]|\\(:?[bfnrtv"\\/]|u[0-9a-fA-F]{4}))*"/,
});
const NumberLiteral = createToken({
  name: "NumberLiteral",
  pattern: /-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/,
});
const TypeKeyword = createToken({name: "TypeKeyword", pattern: /Type/});
const WhiteSpace = createToken({
  name: "WhiteSpace",
  pattern: /[ \t]+/,
  group: Lexer.SKIPPED,
});

const allTokens = [
  TypeKeyword,
  StatementSeparator,
  WhiteSpace,
  NumberLiteral,
  StringLiteral,
  LCurly,
  RCurly,
  LSquare,
  RSquare,
  Comma,
  Equal,
  InitializeOperator,
  Colon,
  True,
  False,
  Null,
  Identifier,
];
const lexer = new Lexer(allTokens);

class GodelParser extends CstParser {
  constructor() {
    super(allTokens);
    this.performSelfAnalysis();
  }

  public document = this.RULE("document", () => {
    this.MANY_SEP({
      SEP: StatementSeparator,
      DEF: () => this.OR([
        // using ES6 Arrow functions to reduce verbosity.
        { ALT: () => this.SUBRULE(this.type) },
      ])
    })
  });

  
  public type = this.RULE('type', () => {
    this.CONSUME(TypeKeyword);
    this.CONSUME(Identifier);
    this.CONSUME(LCurly);
    this.MANY(() => {
      this.CONSUME(StatementSeparator);
      this.OR([
        {ALT: () => this.SUBRULE(this.definitionItem)},
        {ALT: () => this.SUBRULE(this.assignmentItem)},
        {ALT: () => this.SUBRULE(this.initializationItem)},
      ]);      
    });    
    this.CONSUME1(StatementSeparator);
    this.CONSUME(RCurly);
  });

  private definitionItem = this.RULE("definitionItem", () => {
    this.CONSUME1(Identifier);
    this.CONSUME(Colon);
    this.CONSUME2(Identifier);
  });

  private assignmentItem = this.RULE("assignmentItem", () => {
    this.CONSUME(Identifier);
    this.CONSUME(Equal);
    this.SUBRULE(this.expression);
  });

  private initializationItem = this.RULE("initializationItem", () => {
    this.CONSUME(Identifier);
    this.CONSUME(InitializeOperator);
    this.SUBRULE(this.expression);
  });

  private expression = this.RULE("expression", () => {
    this.OR([
      { ALT: () => this.CONSUME(StringLiteral) },
      { ALT: () => this.CONSUME(NumberLiteral) },
      { ALT: () => this.CONSUME(True) },
      { ALT: () => this.CONSUME(False) },
      { ALT: () => this.CONSUME(Null) },
    ]);
  });
}

// reuse the same parser instance.
const parser = new GodelParser();

export const productions: Record<string, Rule> = parser.getGAstProductions();

export function parse(text) {
  const lexResult = lexer.tokenize(text);

  // setting a new input will RESET the parser instance's state.
  parser.input = lexResult.tokens;
  // any top level rule may be used as an entry point
  const cst = parser.document();

  // this would be a TypeScript compilation error because our parser now has a clear API.
  // let value = parser.json_OopsTypo()

  return {
    // This is a pure grammar, the value will be undefined until we add embedded actions
    // or enable automatic CST creation.
    cst: cst,
    lexErrors: lexResult.errors,
    parseErrors: parser.errors,
  };
}