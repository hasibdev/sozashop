import Vue from "vue"

Vue.mixin({
  methods: {
    /**
     * Check the user direct permissions
     * for field/column
     */
    hasFieldViaClient(value) {
      const [menu, page, field] = value.split(".")
      const user = this.$auth.user

      if (!user) return false

      // Check if the user fields exists
      if (user.client.fields) {
        const findMenu = user.client.fields.find(field => field.name == menu)
        const findPage = findMenu.pages.find(p => p.name == page)
        const findField = findPage.fields.find(f => f.name == field)

        return findField ? findField.value : false
      }
      return false
    },

    /**
     * Check the user as a specific permission
     * for field/column
     */
    hasFieldViaModule(value) {
      const [menu, page, field] = value.split(".")
      const user = this.$auth.user

      if (!user) return false

      if (user.client.module.fields) {
        const findMenu = user.client.module.fields.find(
          field => field.name == menu
        )
        const findPage = findMenu.pages.find(p => p.name == page)
        const findField = findPage.fields.find(f => f.name == field)

        return findField ? findField.value : false
      }

      return false
    },

    /**
     * Check the user has a individual field permission
     * for field/column
     */
    hasFieldPermission(value) {
      // If value is boolean
      if (typeof value === "boolean") return value
      //   If value is not boolean
      return this.hasFieldViaClient(value) || this.hasFieldViaModule(value)
    },

    /**
     * Check has page permission via Client
     * for field/column
     */
    hasPageViaClient(value) {
      // Check the user has direct permission of given page
      // 'categories.add-category'
      const [menu, page] = value.split(".")
      const user = this.$auth.user

      if (!user) return false

      // Check if the user fields exists
      if (user.client.fields) {
        const findMenu = user.client.fields.find(field => field.name == menu)
        const findPage = findMenu.pages.find(p => p.name == page)

        if (findPage) {
          return findPage ? findPage.value : false
        } else {
          console.error(`${page} Permission no found`, value)
        }
      }
      return false
    },

    /**
     * Check has page permission via module
     * for page
     */
    hasPageViaModule(value) {
      // Check the user has permission via module of given page
      const [menu, page] = value.split(".")
      const user = this.$auth.user

      if (!user) return false

      if (user.client.module.fields) {
        const findMenu = user.client.module.fields.find(
          field => field.name == menu
        )

        const findPage = findMenu?.pages.find(p => p.name == page)

        if (findPage) {
          return findPage ? findPage.value : false
        } else {
          console.error(`${page} Permission no found`, value)
        }
      }

      return false
    },

    /**
     * Check the user page permission
     * for page
     */
    hasPagePermission(value) {
      if (typeof value === "boolean") return value
      return this.hasPageViaClient(value) || this.hasPageViaModule(value)
    },

    /**
     * Check for Roles
     */
    hasRole(value) {
      const roles = this.$auth.user?.roles
      if (!roles) {
        return false
      }

      return roles.some(role => role.name === value)
      // return true;
    },


    /**
     * Check Action permission via Module
     * for action
     */
    hasActionViaModule(value) {
      const [menu, page, action] = value.split(".")
      const user = this.$auth.user

      if (!user) return false

      // Check if the user fields exists
      if (user.client.module) {
        const findMenu = user.client.module.fields.find(field => field.name == menu)
        const findPage = findMenu.pages.find(p => p.name == page)
        const findAction = findPage.actions.find(f => f.name == action)

        return findAction ? findAction.value : false
      }
      return false
    },

    /**
         * Check Action permission via Client
         * for action
         */
    hasActionViaClient(value) {
      const [menu, page, action] = value.split(".")
      const user = this.$auth.user

      if (!user) return false

      // Check if the user fields exists
      if (user.client.fields) {
        const findMenu = user.client.fields.find(field => field.name == menu)
        const findPage = findMenu.pages.find(p => p.name == page)
        const findAction = findPage.actions.find(f => f.name == action)

        return findAction ? findAction.value : false
      }
      return false
    },

    /**
     * Check for Action Permisstion
     * for dropdown items
     */
    hasActionPermission(value) {
      return this.hasActionViaClient(value) || this.hasActionViaModule(value)
    },

    /**
     * Check for Permission
     */
    hasPermission(value) {
      const roles = this.$auth.user?.roles

      if (!roles) {
        return false
      }

      // Avilable Permissions
      const permissions = roles.reduce((acc, role) => {
        for (const p of role.permissions) {
          acc.push(p.name)
        }
        return acc
      }, [])
      // Check Permission
      return permissions.includes(value)
    },
    /**
     * Marge Permission
     */
    mergePermissions(permissions, modulePermissions) {
      permissions.forEach(permission => {
        // Find same name saved module permission
        const modulePerm = modulePermissions.find(
          perm => permission.name == perm.name
        )

        // Search Pages
        permission.pages.forEach(page => {
          // Find same name saved page from current module permission
          if (modulePerm && modulePerm.pages) {
            const modulePage = modulePerm.pages.find(
              modPage => modPage.name == page.name
            )

            // Check if module page exists
            if (modulePage) {
              page.value = modulePage.value

              if (page.hasOwnProperty('fields')) {
                // Search fields
                page.fields.forEach(field => {
                  // Find same name saved field from current module
                  const moduleField = modulePage.fields.find(
                    modField => modField.name == field.name
                  )

                  // Check module field exists
                  if (moduleField) {
                    // Update field value
                    field.value = moduleField.value
                  }
                })
              }

              // Search actions
              if (page.actions) {
                page.actions.forEach(action => {
                  // Find same name saved action from current module
                  const moduleAction = modulePage.actions.find(
                    modAction => modAction.name == action.name
                  )

                  // Check module action exists
                  if (moduleAction) {
                    // Update field value
                    action.value = moduleAction.value
                  }
                })
              }
            }
          }
        })
      })
    }
  }
})
