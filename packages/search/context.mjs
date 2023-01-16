import React, { createContext, useContext } from 'react'

import { qsm } from 'query-string-manipulator'

const AdminContext = createContext()

export const useAdmin = () => useContext(AdminContext)

export const AdminProvider = ({
  homePath,
  models,
  placeholder,
  publicPath,
  searchPath,
  children,
}) => {
  const searchUrl = `${window.location.protocol}//${window.location.host}${searchPath}`
  const findModel = (appLabel, modelName) =>
    models.find(m => m.app.label === appLabel && m.ident === modelName)
  const linkTo = (appLabel, modelName, pk) => {
    const model = findModel(appLabel, modelName)
    if (model) {
      return `${model.adminUrl}${pk}/change/`
    }
    return null
  }
  const fetchModelResults = (model, query) => {
    return fetch(
      qsm(searchUrl, {
        set: {
          app: model.app.label,
          model: model.ident,
          term: query,
        },
      })
    )
      .then(res => {
        if (res.ok) {
          return res.json()
        }
        return Promise.reject(new Error(`API returned HTTP ${res.status}`))
      })
      .then(data =>
        data.results.map(result => ({
          appLabel: model.app.label,
          detailHref: result.detailHref,
          key: `${model.app.label}-${model.ident}-${result.id}`,
          modelName: model.ident,
          modelVerbose: model.objectName,
          pk: result.id,
          text: result.text,
        }))
      )
  }

  const fetchResults = (query, appendResults) => {
    const promises = []
    for (const model of models) {
      promises.push(
        fetchModelResults(model, query)
          .then(res => {
            appendResults(model, res)
          })
          .catch(console.log)
      )
    }
    return Promise.allSettled(promises)
  }
  const ctx = {
    homePath,
    linkTo,
    fetchResults,
    models,
    placeholder,
    publicPath,
  }

  return <AdminContext.Provider value={ctx}>{children}</AdminContext.Provider>
}
