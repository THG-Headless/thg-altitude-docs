import { visit } from 'unist-util-visit';

export function remarkCustomComponents() {
  return (tree) => {
    visit(tree, 'mdxJsxFlowElement', (node) => {
      // Ensure all arrays in props are properly stringified
      node.attributes = node.attributes.map(attr => {
        if (attr.type === 'mdxJsxAttribute' && typeof attr.value === 'object') {
          return {
            ...attr,
            value: JSON.stringify(attr.value)
          };
        }
        return attr;
      });
    });
  };
}