const testGlobals = {
  get: (key) => {
    const globals = JSON.parse(process.env.MY_TEST_GLOBALS);
    return globals[key];
  },
  set: (key, value) => {
    const globals = JSON.parse(process.env.MY_TEST_GLOBALS || '{}');
    // if (!globals) globals = {};
    globals[key] = value;
    process.env.MY_TEST_GLOBALS = JSON.stringify(globals);
  }
};

export default {
  testGlobals,
};
