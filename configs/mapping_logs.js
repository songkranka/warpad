module.exports = {
    LOGS_GET: {
        getPermission: {
            logBegin: 'Begin | GET Permission process.',
            logData: 'Response :: :resultData',
            logError: 'Response :: :error',
            logEnd: 'End | GET Permission process.'
        },
        getPermissionMenuList: {
            logBegin: 'Begin | GET Permission Menu List process.',
            logData: 'Response :: :resultData',
            logError: 'Response :: :error',
            logEnd: 'End | GET Permission Menu List process.'
        },
        dpGroupMenu: {
            logBegin: 'Begin | GET Dropdown Group Menu process.',
            logData: 'Response :: :resultData',
            logError: 'Response :: :error',
            logEnd: 'End | GET Dropdown Group Menu process.'
        },
        dpEmpRole: {
            logBegin: 'Begin | GET Employee Role process.',
            logData: 'Response :: :resultData',
            logError: 'Response :: :error',
            logEnd: 'End | GET Employee Role process.'
        },
        dpTaskSubCatDashboard: {
            logBegin: 'Begin | GET Dashboard task subcategories process.',
            logData: 'Response :: :resultData',
            logError: 'Response :: :error',
            logEnd: 'End | GET Dashboard task subcategories process.'
        }
    },
    LOGS_POST: {
        permissionMenuByUID: {
            logBegin: 'Begin | POST Permission Menu by EMP_ID process.',
            logData: 'Response :: :resultData',
            logError: 'Response :: :error',
            logEnd: 'End | POST Permission Menu by EMP_ID process.'
        },
        actionPermission: {
            logBegin: 'Begin | POST Create Permission Menu process.',
            logData: 'Response :: :resultData',
            logError: 'Response :: :error',
            logEnd: 'End | POST Create Permission Menu process.'
        },
        employeeById: {
            logBegin: 'Begin | POST Employee by ID process.',
            logData: 'Response :: :resultData',
            logError: 'Response :: :error',
            logEnd: 'End | POST Employee by ID process.'
        },
        addManager: {
            logBegin: 'Begin | POST Create Manager process.',
            logData: 'Response :: :resultData',
            logError: 'Response :: :error',
            logEnd: 'End | POST Create Manager process.'
        },
        apiMenuList: {
            logBegin: 'Begin | POST Menu List process.',
            logData: 'Response :: :resultData',
            logError: 'Response :: :error',
            logEnd: 'End | POST Menu List process.'
        },
        apiMenuById: {
            logBegin: 'Begin | POST Menu by Id process.',
            logData: 'Response :: :resultData',
            logError: 'Response :: :error',
            logEnd: 'End | POST Menu by Id process.'
        },
        actionMenu: {
            logBegin: 'Begin | POST :action Menu process.',
            logData: 'Response :: :resultData',
            logError: 'Response :: :error',
            logEnd: 'End | POST :action Menu process.'
        },
        apiGroupMenuById: {
            logBegin: 'Begin | POST Group Menu by Id process.',
            logData: 'Response :: :resultData',
            logError: 'Response :: :error',
            logEnd: 'End | POST Group Menu by Id process.'
        },
        apiGroupMenuList: {
            logBegin: 'Begin | POST Group Menu List process.',
            logData: 'Response :: :resultData',
            logError: 'Response :: :error',
            logEnd: 'End | POST Group Menu List process.'
        },
        actionGroupMenu: {
            logBegin: 'Begin | POST :action Menu process.',
            logData: 'Response :: :resultData',
            logError: 'Response :: :error',
            logEnd: 'End | POST :action Menu process.'
        }
    }
}