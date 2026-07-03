import type { Recipe, RecipeImage } from 'src/interfaces/RecipeResponse'

function parseImageEntry(img: unknown, index: number): RecipeImage {
  if (typeof img === 'string') {
    return { url: img.trim(), main: index === 0 }
  }
  if (img && typeof img === 'object') {
    const record = img as Record<string, unknown>
    const rawUrl = record.url ?? record.Url
    const url = typeof rawUrl === 'string' ? rawUrl.trim() : ''
    const rawMain = record.main ?? record.Main
    let main = index === 0
    if (typeof rawMain === 'boolean') main = rawMain
    else if (rawMain === 'true' || rawMain === 1) main = true
    return { url, main }
  }
  return { url: '', main: false }
}

/** URL of the main recipe image, or the first image if none is marked main. */
export function getMainImageUrl(images: RecipeImage[] | undefined): string {
  const list = (images ?? []).filter((img) => img.url?.trim())
  const main = list.find((img) => img.main)
  return main?.url?.trim() ?? list[0]?.url?.trim() ?? ''
}

export function getRecipeMainImageUrl(recipe: Pick<Recipe, 'images'> | null | undefined): string {
  if (!recipe) return ''

  const fromNormalized = getMainImageUrl(recipe.images)
  if (fromNormalized) return fromNormalized

  const raw = recipe as Record<string, unknown>
  const rawImages = raw.Images ?? raw.images
  if (Array.isArray(rawImages)) {
    const parsed = rawImages
      .map((img, index) => parseImageEntry(img, index))
      .filter((img) => img.url.length > 0)
    return getMainImageUrl(parsed)
  }

  const rootImage = raw.Image ?? raw.image
  return typeof rootImage === 'string' ? rootImage.trim() : ''
}
