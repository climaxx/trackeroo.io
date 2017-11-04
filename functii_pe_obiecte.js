console.log('start')


const obj = {
  a: 2, funky() {
    console.log('I am funky!!!')


  },

  lam: () => {
    console.log("I am a lamb!")
  }
}

console.log(obj.a)


obj.funky()
obj.lam()
