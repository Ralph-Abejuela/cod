import { createAccessControl } from "better-auth/plugins/access";

import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";


/**
 * make sure to use `as const` so typescript can infer the type correctly
 */
const statement = { 
    project: ["create", "share", "update", "delete"], 
    ...defaultStatements,
} as const; 

export const ac = createAccessControl(statement); 


export const user = ac.newRole({ 
    project: [], 
}); 

export const admin = ac.newRole({ 
    ...adminAc.statements, 
}); 

export const staff = ac.newRole({ 
    project: ["create", "update", "delete"], 
    user: ["ban"], 
}); 

export const allRoles = {
    admin,
    staff,
    user
}