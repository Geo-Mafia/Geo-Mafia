interface ASTExpression {
    readonly type: string;
    readonly [prop: string]: any;
}
export declare function parseExpression(expressionText: string): ASTExpression;
export declare function convertExpressionToValue(expression: ASTExpression, model: any, isBackConvert: boolean, changedModel: any): any;
export {};
