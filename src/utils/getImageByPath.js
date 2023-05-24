const getImageByPath = (imgPath) => {
  return new URL(
    imgPath, import.meta.url
  ).href
}

export default  getImageByPath