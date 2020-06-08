// Exported for the tests :(
export class RBTNode {
  static BLACK = 'black';
  static RED = 'red';
  static sentinel = Object.freeze({ color: RBTNode.BLACK });

  constructor({
    key, value,
    color = RBTNode.RED,
    parent = RBTNode.sentinel,
    left = RBTNode.sentinel,
    right = RBTNode.sentinel,
  }) {
    this.key = key;
    this.value = value;
    this.color = color;
    this.parent = parent;
    this.left = left;
    this.right = right;
  }
}

class RedBlackTree {
  constructor(Node = RBTNode) {
    this.Node = Node;
    this._count = 0;
    this._root = undefined;
  }

  lookup(key) {
    let node = this._root;

    while (node) {
      if (key < node.key) {
        node = node.left;
      } else if (key > node.key) {
        node = node.right;
      } else { // equal
        return node.value;
      }
    }
  }

  /**
   * The two rotation functions are symetric, and could presumably
   * be collapsed into one that takes a direction 'left' or 'right',
   * calculates the opposite, and uses [] instead of . to access.
   * 
   * Felt too confusing to be worth it. Plus I bet* the JIT optimizes two
   * functions with static lookups better than one with dynamic lookups.
   * 
   * (*without any evidence whatsoever, 10 points to anyone who tries it out)
   */
  _rotateLeft(node) {
    const child = node.right;

    if (node === RBTNode.sentinel) {
      throw new Error('Cannot rotate a sentinel node');
    } else if (child === RBTNode.sentinel) {
      throw new Error('Cannot rotate away from a sentinal node');
    }

    // turn child's left subtree into node's right subtree
    node.right = child.left;
    if (child.left !== RBTNode.sentinel) {
      child.left.parent = node;
    }

    // link node's parent to child
    child.parent = node.parent;
    if (node === this._root) {
      this._root = child;
    } else if (node === node.parent.left) {
      node.parent.left = child;
    } else {
      node.parent.right = child;
    }

    // put node on child's left
    child.left = node;
    node.parent = child;

    // LOOK AT ME
    // I'M THE PARENT NOW
  }

  _rotateRight(node) {
    const child = node.left;

    if (node === RBTNode.sentinel) {
      throw new Error('Cannot rotate a sentinel node');
    } else if (child === RBTNode.sentinel) {
      throw new Error('Cannot rotate away from a sentinal node');
    }

    // turn child's right subtree into node's left subtree
    node.left = child.right;
    if (child.right !== RBTNode.sentinel) {
      child.right.parent = node;
    }

    // link node's parent to child
    child.parent = node.parent;
    if (node === this._root) {
      this._root = child;
    } else if (node === node.parent.right) {
      node.parent.right = child;
    } else {
      node.parent.left = child;
    }

    // put node on child's right
    child.right = node;
    node.parent = child;
  }

  _insertInternal(key, value = true) {
    let node = new this.Node({key, value});
    if (this._count === 0) {
      // node.parent = undefined;
      this._root = node;
      this._count += 1;
      return node;
    } else {
      let currentNode  = this._root;
      
      while (currentNode) {
        if (key < currentNode.key) {
          if (currentNode.left === RBTNode.sentinel) {
            node.parent = currentNode;
            currentNode.left = node;
            this._count += 1;

            return node;
          } else {
            currentNode  = currentNode.left;

          }
          
        } else if (key > currentNode.key) {
          if (currentNode.right === RBTNode.sentinel) {
            node.parent = currentNode;
            currentNode.right = node;
            this._count += 1;

            return node;
          } else {
            currentNode = currentNode.right;
          }
        } 
        else {
          currentNode.value  = value;
          return node;
        } 
      } 
    }

  }

  _insertRebalance(node) {
    let uncle;
    while (node.color === RBTNode.RED && node.parent.color === RBTNode.RED) {
      let parent = node.parent;
      let grandparent = parent.parent;
      if (grandparent.left.key === parent.key) {
        uncle = grandparent.right; 

        if (uncle.color === RBTNode.RED) {
          uncle.color = RBTNode.BLACK;
          parent.color = RBTNode.BLACK;
          grandparent.color = RBTNode.RED;
          node = grandparent;
        } else {
          if (parent.right.key === node.key) {
            parent = node;
            node = node.parent;
            this._rotateLeft(node);
          } else {
            parent.color = RBTNode.BLACK;
            grandparent.color = RBTNode.RED;
            this._rotateRight(grandparent);
          }
        }

      } else {
        uncle = grandparent.left;

        if (uncle.color === RBTNode.RED) {
          uncle.color = RBTNode.BLACK;
          parent.color = RBTNode.BLACK;
          grandparent.color = RBTNode.RED;
          node = grandparent;
        } else {
          if (parent.left.key === node.key) {
            parent = node;
            node = node.parent;
            this._rotateRight(node);
          } else {
            parent.color = RBTNode.BLACK;
            grandparent.color = RBTNode.RED;
            this._rotateLeft(grandparent);
          }
        }
      }
    }
  }

  insert(key, value) {
    const node = this._insertInternal(key, value);
    this._insertRebalance(node);
    this._root.color = RBTNode.BLACK;
  }

  delete(key) {

  }

  count() {
    return this._count;
  }

  forEach(callback) {
    
  }
}


export default RedBlackTree;