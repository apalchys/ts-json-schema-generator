import { Definition } from "../Schema/Definition";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { BaseType } from "../Type/BaseType";
import { LiteralType } from "../Type/LiteralType";
import { UnionType } from "../Type/UnionType";
import { uniqueArray } from "../Utils/uniqueArray";

export class LiteralUnionTypeFormatter implements SubTypeFormatter {
    public supportsType(type: UnionType): boolean {
        return type instanceof UnionType && this.isLiteralUnion(type);
    }
    public getDefinition(type: UnionType): Definition {
        const values: (string | number | boolean)[] = uniqueArray(
            type.getTypes().map((item: LiteralType) => item.getValue()));
        const types: string[] = uniqueArray(type.getTypes().map((item: LiteralType) => this.getLiteralType(item)));

        if (types.length === 1) {
            return {
                type: types[0],
                enum: values,
            };
        } else {
            return {
                type: types,
                enum: values,
            };
        }
    }
    public getChildren(type: UnionType): BaseType[] {
        return [];
    }

    private isLiteralUnion(type: UnionType): boolean {
        return type.getTypes().every((item: BaseType) => item instanceof LiteralType);
    }
    private getLiteralType(value: LiteralType): string {
        return value.getValue() === null ? "null" : typeof value.getValue();
    }
}
