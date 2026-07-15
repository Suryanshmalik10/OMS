import { api } from "./client";

export const getRegions = () => api("/regions/");

export const createRegion = (region: any) =>
    api("/regions/", {
        method: "POST",
        body: JSON.stringify(region),
    });

export const deleteRegion = (id: string) =>
    api(`/regions/${id}`, {
        method: "DELETE",
    });
