const p1 = new Promise((res, rej) => {
  setTimeout(() => {
    rej("Hello 1");
  }, 1000);
});

const p2 = new Promise((res, rej) => {
  setTimeout(() => {
    res("Hello 2");
  }, 2000);
});

const p3 = new Promise((res, rej) => {
  setTimeout(() => {
    res("Hello 2");
  }, 10000);
});

const test = async () => {
  try {
    console.time("first");
    const res = await Promise.allSettled([p1, p2, p3]);
    console.time("first", res);
  } catch (error) {
    console.log("errrrrrr", error);
  }
};

test();
