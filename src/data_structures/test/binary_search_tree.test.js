import BinarySearchTree from '../binary_search_tree';
import RedBlackTree from '../red_black_tree';

// Note: RedBlackTrees also have specific tests
// in red_black_tree.test.js

const dataStructures = [
  BinarySearchTree,
  RedBlackTree,
];

dataStructures.forEach(TargetDS => {
  describe(TargetDS, () => {
    let bst;
    beforeEach(() => {
      bst = new TargetDS();
    });

    it('starts empty', () => {
      expect(bst.count()).toBe(0);
    });

    describe('lookup', () => {
      it('returns undefined on an empty tree', () => {
        expect(bst.lookup('test')).toBe(undefined);
      });

      it('returns undefined if the key is not in the tree', () => {
        const keys = ['many', 'keys', 'for', 'this', 'tree'];
        keys.forEach((key, i) => {
          bst.insert(key);
        });

        expect(bst.lookup('dne')).toBe(undefined);
      });

      it('finds the only record', () => {
        bst.insert('test');
        expect(bst.lookup('test')).toBeTruthy();
      });

      it('finds any extant record', () => {
        const keys = ['many', 'keys', 'for', 'this', 'tree'];
        keys.forEach(key => {
          bst.insert(key);
        });

        keys.forEach(key => {
          expect(bst.lookup(key)).toBeTruthy();
        });

        keys.reverse().forEach(key => {
          expect(bst.lookup(key)).toBeTruthy();
        });
      });

      it('returns the value associated with a record', () => {
        const records = [
          { key: 'one', value: 'first' },
          { key: 'two', value: 'second' },
          { key: 'three', value: 'third' },
          { key: 'four', value: 'fourth' },
          { key: 'five', value: 'fifth' },
        ];

        records.forEach(({ key, value }) => {
          bst.insert(key, value);
        });

        records.forEach(({ key, value }) => {
          expect(bst.lookup(key)).toBe(value);
        });

        records.reverse().forEach(({ key, value }) => {
          expect(bst.lookup(key)).toBe(value);
        });
      });
    });

    describe('insert', () => {
      it('increases count by 1', () => {
        expect(bst.count()).toBe(0);
        bst.insert('test');
        expect(bst.count()).toBe(1);

        const keys = ['many', 'keys', 'for', 'this', 'tree'];
        keys.forEach((key, i) => {
          bst.insert(key);
          expect(bst.count()).toBe(2 + i);
        });
      });

      it('replaces records with the same key and does not increase the count', () => {
        bst.insert('test', 'first value');
        expect(bst.count()).toBe(1);
        expect(bst.lookup('test')).toBe('first value');

        bst.insert('test', 'second value');
        expect(bst.count()).toBe(1);
        expect(bst.lookup('test')).toBe('second value');
      });

      it('uses true as the default value', () => {
        bst.insert('test');
        expect(bst.lookup('test')).toBe(true);
      });
    });

    describe('delete', () => {
      it('returns the value for the removed record', () => {
        bst.insert('test');
        expect(bst.delete('test')).toBe('test')
      });

      it('returns undefined if the record was not found', () => {
        bst.insert('test');
        expect(bst.delete('testNotFound')).toBe(undefined);
      });

      it('reduces the count by 1', () => {
        expect(bst.count()).toBe(0);
        bst.insert('one');
        bst.insert('two')
        expect(bst.count()).toBe(2);
        bst.delete('one');
        expect(bst.count()).toBe(1);
      });

      it('omits the removed record from iteration results', () => {
        bst.insert('alpha');
        bst.insert('beta');
        bst.insert('gamma');
        bst.delete('beta');

        const cb = jest.fn();
        bst.forEach(cb);

        expect(cb.mock.calls.length).toBe(2);
        expect(cb.mock.calls[0][0]['key']).toEqual('alpha');
        expect(cb.mock.calls[1][0]['key']).not.toEqual('beta');
        expect(cb.mock.calls[1][0]['key']).toEqual('gamma');
      });

      it('can remove every element in a tree', () => {
        const keys = ['cat', 'apple', 'egret', 'bologna', 'domino'];
        
        keys.forEach(key => {
          bst.insert(key);
        })

        keys.forEach(key => {
          bst.delete(key);
        })

        const cb = jest.fn();
        bst.forEach(cb);
        expect(cb.mock.calls.length).toBe(0);

      });

      describe('scenarios', () => {
        // The first step for each of these tests will be to construct
        // a tree matching the scenario. How can you use your knowledge
        // of how insert works to do this? How can you check your work?

        beforeEach(() => {
          let records = ['camel', 'beetle', 'alpaca', 'dragonfly', 'elephant'];
          
          records.forEach(record => {
            bst.insert(record);
          });
        });

        it('can remove the record with the smallest key', () => {
          // Insert several records
          // Remove the record with the smallest key
          // Ensure that looking up that key returns undefined
          bst.delete('alpaca');
          expect(bst.lookup('alpaca')).toBe(undefined);
        });

        it('can remove the record with the largest key', () => {
          bst.delete('elephant');
          expect(bst.lookup('elephant')).toBe(undefined);
        });

        it('can remove the root', () => {
          bst.delete('camel');
          expect(bst.lookup('camel')).toBe(undefined);
        });

        it('can remove a node with no children', () => {
          bst.delete('alpaca');
          expect(bst.lookup('alpaca')).toBe(undefined);
        });

        it('can remove a node with only a left child', () => {
          bst.delete('beetle');
          expect(bst.lookup('beetle')).toBe(undefined);
        });

        it('can remove a node with only a right child', () => {
          bst.delete('dragonfly');
          expect(bst.lookup('dragonfly')).toBe(undefined);
        });

        it('can remove a node with both children, where the successor is the node\'s right child', () => {
          bst.delete('camel');
          expect(bst.lookup('camel')).toBe(undefined);
          
          expect(bst._root.key).toBe('dragonfly');
        });

        it('can remove a node with both children, where the successor is not the node\'s right child', () => {
          bst.delete('beetle');
          expect(bst._root.left.key).toBe('alpaca');
        });
      });
    });

    describe('forEach', () => {
      let records;
      beforeEach(() => {
        records = [
          { key: 'one', value: 'first' },
          { key: 'two', value: 'second' },
          { key: 'three', value: 'third' },
          { key: 'four', value: 'fourth' },
          { key: 'five', value: 'fifth' },
        ];
      });

      const sortRecords = (records) => {
        return records.sort((a, b) => a.key.localeCompare(b.key));
      }

      const fill = (records) => {
        records.forEach(({ key, value }) => {
          bst.insert(key, value);
        });
      }

      it('runs the callback 0 times on an empty tree', () => {
        const cb = jest.fn();
        bst.forEach(cb);

        expect(cb.mock.calls.length).toBe(0);
      });

      it('provides {key, value}, index and tree as cb args', () => {
        bst.insert('key', 'value');

        const cb = jest.fn();
        bst.forEach(cb);

        const callArgs = cb.mock.calls[0];
        expect(callArgs[0].key).toBe('key');
        expect(callArgs[0].value).toBe('value');
        expect(callArgs[1]).toBe(0);
        expect(callArgs[2]).toBe(bst);
      });

      it('iterates records in key order', () => {
        fill(records);

        const cb = jest.fn();
        bst.forEach(cb);

        sortRecords(records).forEach(({ key, value }, i) => {
          const callArgs = cb.mock.calls[i];
          expect(callArgs[0].key).toBe(key);
          expect(callArgs[0].value).toBe(value);
          expect(callArgs[1]).toBe(i);
          expect(callArgs[2]).toBe(bst);
        });
      });

      it('iterates correctly for sorted input', () => {
        fill(sortRecords(records));

        const cb = jest.fn();
        bst.forEach(cb);

        sortRecords(records).forEach(({ key, value }, i) => {
          const callArgs = cb.mock.calls[i];
          expect(callArgs[0].key).toBe(key);
          expect(callArgs[0].value).toBe(value);
          expect(callArgs[1]).toBe(i);
          expect(callArgs[2]).toBe(bst);
        });
      });

      it('iterates correctly for reverse-sorted input', () => {
        fill(sortRecords(records).reverse());

        const cb = jest.fn();
        bst.forEach(cb);

        sortRecords(records).forEach(({ key, value }, i) => {
          const callArgs = cb.mock.calls[i];
          expect(callArgs[0].key).toBe(key);
          expect(callArgs[0].value).toBe(value);
          expect(callArgs[1]).toBe(i);
          expect(callArgs[2]).toBe(bst);
        });
      });
    });
  });
});