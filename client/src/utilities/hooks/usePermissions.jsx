import { useSelector } from "react-redux"

export default function usePermissions() {
    const roleSelector = useSelector((state) => state.roles)

    const formatPermissions = (permissions) => {
        let formattedPermissions = {}
        for (const prop in permissions) {
            formattedPermissions = {
                ...formattedPermissions,
                [prop.replaceAll("-", "_")]: typeof permissions[prop] === 'object'
                    ? formatPermissions(permissions[prop])
                    : permissions[prop]
            }
        }
        return formattedPermissions
    }

    return formatPermissions(roleSelector.access.permission)
}