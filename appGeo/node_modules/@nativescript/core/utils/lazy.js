export default function lazy(action) {
    let _value;
    return () => _value || (_value = action());
}
//# sourceMappingURL=lazy.js.map