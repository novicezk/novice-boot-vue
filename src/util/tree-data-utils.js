export default {
    findTreePathByArray(id, array) {
        for (const key in array) {
            let path = this.findTreePath(id, array[key]);
            if (path) {
                return path;
            }
        }
        return null;
    },
    findTreePath(id, node, path = []) {
        path.push(node.id);
        if (id == node.id) {
            return path;
        }
        if (!node.children || node.children.length == 0) {
            return null;
        }
        for (const key in node.children) {
            const element = node.children[key];
            let tmpPath = this.findTreePath(id, element, [...path]);
            if (tmpPath) {
                return tmpPath;
            }
        }
        return null;
    },
    findLastByArray(array) {
        return !array || array.length == 0
            ? undefined
            : array[array.length - 1];
    }
}