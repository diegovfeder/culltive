export default function signIn() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        token: 'asdagasgasdsada',
        user: {
          name: 'Diego',
          email: 'diegovfeder@gmail.com',
        },
      });
    }, 1000);
  });
}
