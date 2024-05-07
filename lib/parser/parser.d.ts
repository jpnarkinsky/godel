import type { CstNode, ICstVisitor, IToken } from "chevrotain";

export interface DocumentCstNode extends CstNode {
  name: "document";
  children: DocumentCstChildren;
}

export type DocumentCstChildren = {
  type?: TypeCstNode[];
};

export interface TypeCstNode extends CstNode {
  name: "type";
  children: TypeCstChildren;
}

export type TypeCstChildren = {
  TypeKeyword: IToken[];
  TypeIdentifier: IToken[];
  LCurly: IToken[];
  definitionItem?: DefinitionItemCstNode[];
  assignmentItem?: AssignmentItemCstNode[];
  initializationItem?: InitializationItemCstNode[];
  NewLine?: IToken[];
  RCurly: IToken[];
};

export interface DefinitionItemCstNode extends CstNode {
  name: "definitionItem";
  children: DefinitionItemCstChildren;
}

export type DefinitionItemCstChildren = {
  AttributeIdentifier: IToken[];
  Colon: IToken[];
  value: ValueCstNode[];
};

export interface AssignmentItemCstNode extends CstNode {
  name: "assignmentItem";
  children: AssignmentItemCstChildren;
}

export type AssignmentItemCstChildren = {
  AttributeIdentifier: IToken[];
  Equal: IToken[];
  value: ValueCstNode[];
};

export interface InitializationItemCstNode extends CstNode {
  name: "initializationItem";
  children: InitializationItemCstChildren;
}

export type InitializationItemCstChildren = {
  AttributeIdentifier: IToken[];
  Tilde: IToken[];
  value: ValueCstNode[];
};

export interface ValueCstNode extends CstNode {
  name: "value";
  children: ValueCstChildren;
}

export type ValueCstChildren = {
  StringLiteral?: IToken[];
  NumberLiteral?: IToken[];
  True?: IToken[];
  False?: IToken[];
  Null?: IToken[];
};

export interface ICstNodeVisitor<IN, OUT> extends ICstVisitor<IN, OUT> {
  document(children: DocumentCstChildren, param?: IN): OUT;
  type(children: TypeCstChildren, param?: IN): OUT;
  definitionItem(children: DefinitionItemCstChildren, param?: IN): OUT;
  assignmentItem(children: AssignmentItemCstChildren, param?: IN): OUT;
  initializationItem(children: InitializationItemCstChildren, param?: IN): OUT;
  value(children: ValueCstChildren, param?: IN): OUT;
}
