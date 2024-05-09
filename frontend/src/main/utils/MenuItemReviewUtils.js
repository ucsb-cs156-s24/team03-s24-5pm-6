import { toast } from "react-toastify";

export function onDeleteSuccess(message) {
    console.log(message);
    toast(message);
}

export function cellToAxiosParamsDelete(cell) {
    return {
        url: "/api/menuitemreviews",
        method: "DELETE",
        params: {
            id: cell.row.values.id
        }
    }
}

