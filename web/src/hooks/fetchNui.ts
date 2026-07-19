type NuiResponse<T = unknown> = T;

type NuiData = Record<string, unknown> | unknown;

interface FiveMWindow extends Window {
  GetParentResourceName?: () => string;
}

export const fetchNui = async <T = unknown>(
  eventName: string,
  data?: NuiData
): Promise<T> => {
  const options: RequestInit = {
    method: "post",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(data),
  };

  const resourceName =
    (window as FiveMWindow).GetParentResourceName?.() ?? "rlcore";
  const resp = await fetch(`https://${resourceName}/${eventName}`, options);
  const respFormatted: NuiResponse<T> = await resp.json();

  return respFormatted;
};