class BSTNode {
  constructor({ key, value, parent, left, right }) {
    this.key = key;
    this.value = value;
    this.parent = parent;
    this.left = left;
    this.right = right;
  }
}

class BinarySearchTree {
  constructor(Node = BSTNode) {
    this.Node = Node;
    this._count = 0;
    this._root = undefined;
  }

  insert(key, value = true) {
    // TODO
    let node = new this.Node({key, value});
    if (this._count === 0) {
      node.parent = undefined;
      this._root = node;
      this._count += 1;
      return node;
    } else {
      let currentNode  = this._root;

      while (currentNode) {
        if (key < currentNode.key) {
          if (currentNode.left) {
            currentNode  = currentNode.left;
          } else {
            node.parent = currentNode;
            currentNode.left = node;
            this._count += 1;

            return currentNode;
          }
          
        } else if (key > currentNode.key) {
          if (currentNode.right) {
            currentNode = currentNode.right;
          } else {
            node.parent = currentNode;
            currentNode.right = node;
            this._count += 1;

            return currentNode;
          }
        } else {
          currentNode.value  = value;
          return currentNode;
        } 
      } 
    }

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

  delete(key) {
    let node = this.lookup(key);
    if (node) {
      this._count -= 1;
        let findAndDelete = (currentNode, nodeToDelete) => {
          if (nodeToDelete < currentNode.key) {
            if (currentNode.left) {
              findAndDelete(currentNode.left, nodeToDelete);
            } 
          } else if (nodeToDelete > currentNode.key) {
            if (currentNode.right) {
              findAndDelete(currentNode.right, nodeToDelete);
            }
          } else {            
            if (!currentNode.left && !currentNode.right) {
              if (currentNode.parent) {
                if (currentNode.parent.right && currentNode.parent.right.key === nodeToDelete) {
                    currentNode.parent.right = undefined;
                  } else {
                  this._root = undefined;
                }
              } else {
                currentNode = undefined;
              }
            } else if (!currentNode.left) {
              if (currentNode.parent) {
                if (currentNode.parent.right.key === nodeToDelete) {
                  currentNode.parent.right = currentNode.right;
                } else {
                  currentNode.parent.left = currentNode.right;
                  currentNode.right.parent = currentNode.parent;
                }
              }
            } else if (!currentNode.right) {
              if (currentNode.parent) {
                if (currentNode.parent.right.key === nodeToDelete) {
                  currentNode.parent.right = currentNode.left;
                } else {
                  currentNode.parent.left = currentNode.left;
                }
              }
            } else {
              let connectingNode = currentNode.right;

              while (connectingNode.left) {
                connectingNode = connectingNode.left
              }
              findAndDelete(currentNode.right, connectingNode.key);
              currentNode.key = connectingNode.key;
              currentNode.value = connectingNode.value;
              if (currentNode.left) {
                currentNode.left.parent = currentNode;
              }
              if (currentNode.right) {
                currentNode.right.parent = currentNode;
              }
            }
          }
        }
        findAndDelete(this._root, key);
    }
    return node ? key : undefined;

  }

  count() {
    return this._count;
  }

  forEach(callback) {
    // This is a little different from the version presented in the video.
    // The form is similar, but it invokes the callback with more arguments
    // to match the interface for Array.forEach:
    //   callback({ key, value }, i, this)
    const visitSubtree = (node, callback, i = 0) => {
      if (node) {
        i = visitSubtree(node.left, callback, i);
        callback({ key: node.key, value: node.value }, i, this);
        i = visitSubtree(node.right, callback, i + 1);
      }
      return i;
    }
    visitSubtree(this._root, callback)
  }
}

export default BinarySearchTree;