import { Button as ButtonDefinition } from '.';
import { TextBase } from '../text-base';
import { AccessibilityRole } from '../../accessibility';
export declare abstract class ButtonBase extends TextBase implements ButtonDefinition {
    static tapEvent: string;
    accessible: boolean;
    accessibilityRole: AccessibilityRole;
    get textWrap(): boolean;
    set textWrap(value: boolean);
}
