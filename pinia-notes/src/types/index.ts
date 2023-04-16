
import { AxiosError, AxiosResponse } from 'axios'
export type UserInfo = {
    email: string,
    exp: number,
    iat: number,
    id: number,
    name: string
}

export type Task = {
    id: string;
    title: string;
    description: string;
    isFav: boolean;
    list_items: SubTask;
}
export type SubTask ={
    id: string;
    title: string;
    // isComplete: boolean;
    listId: string;
}

// export type AuthStore = {
//     id: number,
//     name: string,
//     accessToken: string,
//     isAuthenticated: boolean,
//     error: string,
//     user: UserInfo | null;
//     logout: () => void;
//     // authState: StateTree
// }

export interface Auth {
    email: string;
    password: string;
    name?: string; 
    accessToken: string
  }
  export type AuthStoreState ={
    loading: boolean
    accessToken: string
    refreshTokenTimeout: number
    isAuthenticated: boolean,
    error: string
    user: UserInfo | null

    logout: () => void;
}

export type useTaskStoreState ={
    tasks: Task[];
    loading: boolean;
    error: AxiosError | null;
}
export type TaskStoreState= {
    tasks:Task|null
    loading:any
    error:Error|null

}

export type  useTaskStoreActions ={
    getTasks(): Promise<void>;
    addTask(task: Task): Promise<void>;
    deleteTask(taskId: string): Promise<void>;
    loadTaskDetails(taskId: string): Promise<void>;
    addSubTask(taskId: string, newSubTask: SubTask): Promise<void>;
    deleteSubTask(subTask: { item: SubTask; }): Promise<void>;
    toggleFav(id: string): void;
}