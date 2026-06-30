const cache = {}

function play(name) {
  if (!cache[name]) {
    cache[name] = new Audio(`/assets/${name}.wav`)
    cache[name].volume = 0.3
  }
  const snd = cache[name].cloneNode()
  snd.volume = cache[name].volume
  snd.play().catch(() => {})
}

export const sfx = {
  hover: () => play('hover'),
  click: () => play('click'),
  pop:   () => play('pop'),
}
