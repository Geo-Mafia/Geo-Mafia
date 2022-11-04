/**
 * Consume a CSS3 parsed stylesheet and convert the rules and selectors to the
 * NativeScript internal JSON representation.
 */
export class CSSNativeScript {
    parseStylesheet(stylesheet) {
        return {
            type: 'stylesheet',
            stylesheet: {
                rules: this.parseRules(stylesheet.rules),
            },
        };
    }
    parseRules(rules) {
        return rules.map((rule) => this.parseRule(rule));
    }
    parseRule(rule) {
        if (rule.type === 'at-rule') {
            return this.parseAtRule(rule);
        }
        else if (rule.type === 'qualified-rule') {
            return this.parseQualifiedRule(rule);
        }
    }
    parseAtRule(rule) {
        if (rule.name === 'import') {
            // TODO: We have used an "@import { url('path somewhere'); }" at few places.
            return {
                import: rule.prelude
                    .map((m) => (typeof m === 'string' ? m : m.text))
                    .join('')
                    .trim(),
                type: 'import',
            };
        }
        return;
    }
    parseQualifiedRule(rule) {
        return {
            type: 'rule',
            selectors: this.preludeToSelectorsStringArray(rule.prelude),
            declarations: this.ruleBlockToDeclarations(rule.block.values),
        };
    }
    ruleBlockToDeclarations(declarationsInputTokens) {
        // return <any>declarationsInputTokens;
        const declarations = [];
        let property = '';
        let value = '';
        let reading = 'property';
        for (let i = 0; i < declarationsInputTokens.length; i++) {
            const inputToken = declarationsInputTokens[i];
            if (reading === 'property') {
                if (inputToken === ':') {
                    reading = 'value';
                }
                else if (typeof inputToken === 'string') {
                    property += inputToken;
                }
                else {
                    property += inputToken.text;
                }
            }
            else {
                if (inputToken === ';') {
                    property = property.trim();
                    value = value.trim();
                    declarations.push({ type: 'declaration', property, value });
                    property = '';
                    value = '';
                    reading = 'property';
                }
                else if (typeof inputToken === 'string') {
                    value += inputToken;
                }
                else {
                    value += inputToken.text;
                }
            }
        }
        property = property.trim();
        value = value.trim();
        if (property || value) {
            declarations.push({ type: 'declaration', property, value });
        }
        return declarations;
    }
    preludeToSelectorsStringArray(prelude) {
        const selectors = [];
        let selector = '';
        prelude.forEach((inputToken) => {
            if (typeof inputToken === 'string') {
                if (inputToken === ',') {
                    if (selector) {
                        selectors.push(selector.trim());
                    }
                    selector = '';
                }
                else {
                    selector += inputToken;
                }
            }
            else if (typeof inputToken === 'object') {
                selector += inputToken.text;
            }
        });
        if (selector) {
            selectors.push(selector.trim());
        }
        return selectors;
    }
}
//# sourceMappingURL=CSSNativeScript.js.map