export async function login(username: string, password: string) {

    const body = new URLSearchParams();

    body.append("username", username);
    body.append("password", password);

    const response = await fetch(
        "http://localhost:8000/auth/login",
        {
            method: "POST",
            body,
        }
    );

    const data = await response.json();

    localStorage.setItem("token", data.access_token);

    return data;
}
