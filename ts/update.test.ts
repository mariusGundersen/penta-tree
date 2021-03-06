import test from 'ava';

import createNode from './createNode';
import update from './update';

test('null', t => {
  const updater = update(undefined, () => undefined);
  updater.update({ top: 0, left: 0 }, undefined);
  t.is(updater.result(), undefined);
});

test('data', t => {
  t.plan(6);
  const tree = {
    ...createNode(1),
    data: 'old'
  };
  const context = {};
  const updater = update(tree, (old, ctx, pos) => {
    t.is(old, 'old');
    t.deepEqual(pos, { top: 0, left: 0 });
    t.is(ctx, context);
    return 'new';
  });
  updater.update({ top: 0, left: 0 }, context);
  const result = updater.result();
  t.not(result, null);
  t.not(tree, result);
  t.is(result.data, 'new');
});

test('data changed second time', t => {
  t.plan(7);
  let data = 'old';
  const tree = {
    ...createNode<string>(1),
    data
  };
  const updater = update(tree, (old, ctx: undefined, pos) => {
    t.is(old, data);
    t.deepEqual(pos, { top: 0, left: 0 });
    data = 'new';
    return data;
  });
  updater.update({ top: 0, left: 0 }, undefined);
  updater.update({ top: 0, left: 0 }, undefined);
  const result = updater.result();
  t.not(result, null);
  t.not(tree, result);
  t.is(result.data, 'new');
});

test('data changed back to original value', t => {
  const tree = {
    ...createNode(1),
    data: 'old'
  };
  const updater = update(tree, (old, ctx, pos) => ctx);
  updater.update({ top: 0, left: 0 }, 'new');
  updater.update({ top: 0, left: 0 }, 'old');
  const result = updater.result();
  t.is(tree, result);
});

test('data changed but unchanged returns true', t => {
  const tree = {
    ...createNode(1),
    data: 'old'
  };
  const updater = update(tree, (old, ctx, pos) => ctx, () => true);
  updater.update({ top: 0, left: 0 }, 'new');
  const result = updater.result();
  t.is(tree, result);
});

test('convenient result', t => {
  let data = 0;
  const tree = {
    ...createNode<number>(1),
    data
  };
  const updater = update(tree, old => old + 1);
  const result = updater.result([
    { area: { top: 0, left: 0 } },
    { area: { top: 0, left: 0 } },
    { area: { top: 0, left: 0 } }
  ] as any);
  t.not(result, null);
  t.not(tree, result);
  t.is(result.data, 3);
});

test('topLeft', t => {
  const tree = {
    ...createNode(2),
    topLeft: {
      ...createNode(1),
      data: 'old'
    }
  };
  const context = {};
  const updater = update(tree, (old, ctx, pos) => {
    t.is(old, 'old');
    t.is(ctx, context);
    t.deepEqual(pos, { top: 0, left: 0 });
    return 'new';
  });
  updater.update({ top: 0, left: 0 }, context);
  const result = updater.result();
  t.not(tree, result);
  t.not(tree.topLeft, result.topLeft);
  t.is(result.topLeft!.data, 'new');
});

test('topRight', t => {
  const tree = {
    ...createNode(2),
    topRight: {
      ...createNode(1),
      data: 'old'
    }
  };
  const context = {};
  const updater = update(tree, (old, ctx, pos) => {
    t.is(old, 'old');
    t.is(ctx, context);
    t.deepEqual(pos, { top: 0, left: 0 });
    return 'new';
  });
  updater.update({ top: 0, left: 1 }, context);
  const result = updater.result();
  t.not(tree, result);
  t.not(tree.topRight, result.topRight);
  t.is(result.topRight!.data, 'new');
});

test('bottomLeft', t => {
  const tree = {
    ...createNode(2),
    bottomLeft: {
      ...createNode(1),
      data: 'old'
    }
  };
  const context = {};
  const updater = update(tree, (old, ctx, pos) => {
    t.is(old, 'old');
    t.is(ctx, context);
    t.deepEqual(pos, { top: 0, left: 0 });
    return 'new';
  });
  updater.update({ top: 1, left: 0 }, context);
  const result = updater.result();
  t.not(tree, result);
  t.not(tree.bottomLeft, result.bottomLeft);
  t.is(result.bottomLeft!.data, 'new');
});

test('bottomRight', t => {
  const tree = {
    ...createNode(2),
    bottomRight: {
      ...createNode(1),
      data: 'old'
    }
  };
  const context = {};
  const updater = update(tree, (old, ctx, pos) => {
    t.is(old, 'old');
    t.is(ctx, context);
    t.deepEqual(pos, { top: 0, left: 0 });
    return 'new';
  });
  updater.update({ top: 1, left: 1 }, context);
  const result = updater.result();
  t.not(tree, result);
  t.not(tree.bottomRight, result.bottomRight);
  t.is(result.bottomRight!.data, 'new');
});

test('topLeft only', t => {
  const tree = {
    ...createNode(2),
    topLeft: {
      ...createNode(1),
      data: 'old'
    },
    topRight: {
      ...createNode(1),
      data: 'old'
    },
    bottomLeft: {
      ...createNode(1),
      data: 'old'
    },
    bottomRight: {
      ...createNode(1),
      data: 'old'
    }
  };
  const updater = update(tree, _ => 'new');
  updater.update({ top: 0, left: 0 }, undefined);
  const result = updater.result();
  t.not(tree, result);
  t.not(tree.topLeft, result.topLeft);
  t.is(tree.topRight, result.topRight);
  t.is(tree.bottomLeft, result.bottomLeft);
  t.is(tree.bottomRight, result.bottomRight);
});

test('topRight only', t => {
  const tree = {
    ...createNode(2),
    topLeft: {
      ...createNode(1),
      data: 'old'
    },
    topRight: {
      ...createNode(1),
      data: 'old'
    },
    bottomLeft: {
      ...createNode(1),
      data: 'old'
    },
    bottomRight: {
      ...createNode(1),
      data: 'old'
    }
  };
  const updater = update(tree, _ => 'new');
  updater.update({ top: 0, left: 1 }, undefined);
  const result = updater.result();
  t.not(tree, result);
  t.is(tree.topLeft, result.topLeft);
  t.not(tree.topRight, result.topRight);
  t.is(tree.bottomLeft, result.bottomLeft);
  t.is(tree.bottomRight, result.bottomRight);
});

test('bottomLeft only', t => {
  const tree = {
    ...createNode(2),
    topLeft: {
      ...createNode(1),
      data: 'old'
    },
    topRight: {
      ...createNode(1),
      data: 'old'
    },
    bottomLeft: {
      ...createNode(1),
      data: 'old'
    },
    bottomRight: {
      ...createNode(1),
      data: 'old'
    }
  };
  const updater = update(tree, _ => 'new');
  updater.update({ top: 1, left: 0 }, undefined);
  const result = updater.result();
  t.not(tree, result);
  t.is(tree.topLeft, result.topLeft);
  t.is(tree.topRight, result.topRight);
  t.not(tree.bottomLeft, result.bottomLeft);
  t.is(tree.bottomRight, result.bottomRight);
});

test('bottomRight only', t => {
  const tree = {
    ...createNode(2),
    topLeft: {
      ...createNode(1),
      data: 'old'
    },
    topRight: {
      ...createNode(1),
      data: 'old'
    },
    bottomLeft: {
      ...createNode(1),
      data: 'old'
    },
    bottomRight: {
      ...createNode(1),
      data: 'old'
    }
  };
  const updater = update(tree, _ => 'new');
  updater.update({ top: 1, left: 1 }, undefined);
  const result = updater.result();
  t.not(tree, result);
  t.is(tree.topLeft, result.topLeft);
  t.is(tree.topRight, result.topRight);
  t.is(tree.bottomLeft, result.bottomLeft);
  t.not(tree.bottomRight, result.bottomRight);
});

test('center', t => {
  t.plan(7);
  const tree = {
    ...createNode(4),
    center: {
      top: 1,
      left: 1,
      right: 3,
      bottom: 3,
      data: 'old'
    }
  };
  const context = {};
  const updater = update(tree, (old, ctx, pos) => {
    t.is(old, 'old');
    t.is(pos.top, 1);
    t.is(pos.left, 1);
    t.is(ctx, context);
    return 'new';
  });
  updater.update({ top: 2, left: 2 }, context);
  const result = updater.result();
  t.not(result, null);
  t.not(tree, result);
  t.is(result.center!.data, 'new');
});

test('center changed back to original value', t => {
  const tree = {
    ...createNode(4),
    center: {
      top: 1,
      left: 1,
      right: 3,
      bottom: 3,
      data: 'old'
    }
  };
  const updater = update(tree, (old, ctx, pos) => ctx);
  updater.update({ top: 2, left: 2 }, 'new');
  updater.update({ top: 2, left: 2 }, 'old');
  const result = updater.result();
  t.is(tree, result);
});

test('center changed but unchanged returns true', t => {
  const tree = {
    ...createNode(4),
    center: {
      top: 1,
      left: 1,
      right: 3,
      bottom: 3,
      data: 'old'
    }
  };
  const updater = update(tree, (old, ctx, pos) => ctx, () => true);
  updater.update({ top: 2, left: 2 }, 'new');
  const result = updater.result();
  t.is(tree, result);
});

test('top', t => {
  t.plan(7);
  const tree = {
    ...createNode(4),
    top: [{
      top: 0,
      left: 1,
      right: 3,
      bottom: 2,
      data: 'old'
    }]
  };
  const context = {};
  const updater = update(tree, (old, ctx, pos) => {
    t.is(old, 'old');
    t.is(pos.top, 1);
    t.is(pos.left, 1);
    t.is(ctx, context);
    return 'new';
  });
  updater.update({ top: 1, left: 2 }, context);
  const result = updater.result();
  t.not(result, null);
  t.not(tree, result);
  t.is(result.top[0].data, 'new');
});

test('top changed back to original value', t => {
  const tree = {
    ...createNode(4),
    top: [{
      top: 0,
      left: 1,
      right: 3,
      bottom: 2,
      data: 'old'
    }]
  };
  const updater = update(tree, (old, ctx, pos) => ctx);
  updater.update({ top: 1, left: 2 }, 'new');
  updater.update({ top: 1, left: 2 }, 'old');
  const result = updater.result();
  t.is(tree, result);
});

test('top changed but unchanged returns true', t => {
  const tree = {
    ...createNode(4),
    top: [{
      top: 0,
      left: 1,
      right: 3,
      bottom: 2,
      data: 'old'
    }]
  };
  const updater = update(tree, (old, ctx, pos) => ctx, () => true);
  updater.update({ top: 1, left: 2 }, 'new');
  const result = updater.result();
  t.is(tree, result);
});


test('topLeft changed but unchanged returns true', t => {
  const tree = {
    ...createNode(2),
    topLeft: {
      ...createNode(1),
      data: 'old'
    }
  };
  const updater = update(tree, (old, ctx, pos) => ctx, () => true);
  updater.update({ top: 0, left: 0 }, 'new');
  const result = updater.result();
  t.is(tree.topLeft, result.topLeft);
});
