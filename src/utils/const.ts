export const pagesQuery = `*[_type == $documentType && !(_id in path('drafts.**'))]{
    _id,_type,_updatedAt,"title": coalesce(title,name)
  } | order(_updatedAt desc)`
