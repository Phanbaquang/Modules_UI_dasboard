import axios, {
    AxiosInstance,
    AxiosRequestConfig,
    InternalAxiosRequestConfig,
} from "axios";
class Services {
    axios: AxiosInstance;
    constructor() {
        this.axios = axios.create({
            baseURL: "http://localhost:8017/v1/api",
            withCredentials: false,
        });
        this.axios.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                // const token = localStorage.getItem("token");
                // if (token) {
                config.headers.set("Authorization", `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwicGFzc3dvcmQiOiIxMjM0NTYiLCJpYXQiOjE3NDQ2NjQ5MjAsImV4cCI6MTc0NDY5MzcyMH0.Ah7I8aTRgVYLzgXj2s1OO6qvGyfb-JQznKZzMUwZ8Kg`);
                // }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );
        this.axios.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                // if (error.response?.status === 401 && !originalRequest._retry) {
                //     originalRequest._retry = true;

                //     try {
                //         const mailrefetch = localStorage.getItem("mail");
                //         const { data } = await AuthServices.refreshToken({
                //             mail: mailrefetch ?? "",
                //         });
                //         localStorage.setItem("token", data.accessToken);
                //         originalRequest.headers[
                //             "Authorization"
                //         ] = `Bearer ${data.accessToken}`;
                //         return this.axios(originalRequest);
                //     } catch (err) {
                //         return Promise.reject(err);
                //     }
                // }
                return Promise.reject(error);
            }
        );
    }

    async get(url: string, config?: AxiosRequestConfig) {
        try {
            // (document.querySelector("#page_loader") as HTMLElement).style.display =
            //     "block";
            const res = await this.axios.get(url, config);
            return res;
        } catch (error) {
        } finally {
            // (document.querySelector("#page_loader") as HTMLElement).style.display =
            //     "none";
        }
    }
    async post(url: string, data: any, config?: AxiosRequestConfig) {
        // (document.querySelector("#page_loader") as HTMLElement).style.display =
        //     "block";
        try {
            const res = await this.axios.post(url, data, config);
            return res;
        } catch (error) {
        } finally {
            // (document.querySelector("#page_loader") as HTMLElement).style.display =
            //     "none";
        }
    }
    delete(url: string, config?: AxiosRequestConfig) {
        return this.axios.delete(url, config);
    }

    put(url: string, data: any, config?: AxiosRequestConfig) {
        return this.axios.put(url, data, config);
    }
}

const servicesInstance = new Services();
export default servicesInstance;