import { computed, ref, reactive } from 'vue'
import { defineStore } from "pinia";
import axios, { AxiosError, AxiosResponse } from 'axios'
import { Task, SubTask, TaskStoreState, useTaskStoreActions } from '@/types';

export const useTaskStore = defineStore('taskStore', () => {

    // state
    const tasks = ref<any|null>(null)
    const loading = ref(false)
    const error = ref<any>(null)


    const getTasks = () => {
        loading.value = true
        const res = axios
            .get('/List')
            .then(response => {
                // console.log(response.data)
                tasks.value = response.data
            })
            .catch(error => {
                console.log(error)
                error.value = error.message || 'Something went wrong'
            })
            .finally(() => loading.value = false)
    };

    //Main tasks
    const addTask = async (task: Task[]) => {
        // console.log(task)

        const result = await axios
            .post('/List', task)
            .then(response => {
                // console.log(response.data);
                tasks.value.push(response.data)
            })
            .catch(error => {
                console.log(error)
                error.value = error.message || 'Something went wrong'
            })
            .finally(() => loading.value = false)
    };

    const deleteTask = async (TaskId: Task) => {
        loading.value = true

        const res = await axios
            .delete('/List/' + TaskId)
            .then(response => {
                // console.log(response.data)
                tasks.value = tasks.filter((t: any) => {
                    return t.id !== TaskId
                })
            })
            .catch(error => {
                console.log(error)
                error.value = error.message || 'Something went wrong'
            })
            .finally(() => loading.value = false)
    };
    const loadTaskDetails = async (taskId: SubTask) => {
        loading.value = true

        const res = axios
            .get(`/List/${taskId}`)
            .then(response => {
                // console.log(response.data);

                const subTask = tasks.value.find((t: any) => t.id === taskId);
                subTask.list_items = response.data.list_items;
            })
            .catch(error => {
                console.log(error)
                error.value = error.message || 'Something went wrong'
            })
            .finally(() => loading.value = false)
    };

    // Subtasks
    const addSubTask = async (TaskId: Task, newSubTask: SubTask) => {
        loading.value = true

        const res = await axios
            .post(`/List/${TaskId}/list-item`, newSubTask)
            .then(response => {
                console.log(response.data)

                const subTask = tasks.value.find((t: any) => t.id === TaskId)
                subTask.list_items = response.data.list_items
            })
            .catch(error => {
                console.log(error)
                error.value = error || 'Something went wrong'
            })
            .finally(() => loading.value = false)
    };

    const deleteSubTask = async (subItem: any) => {
        const taskId = subItem.item.listId
        const subTaskId = subItem.item.id

        loading.value = true

        const res = await axios
            .delete(`/List/${taskId}/list-item/${subTaskId}`)
            .then(response => {
                // console.log(response.data)
                const task = tasks.value.find((t: Task) => t.id === taskId)
                task.list_items = task.list_items.filter((item: Task) => item.id !== subTaskId)

            })
            .catch(error => {
                console.log(error)
                error.value = error.message || 'Something went wrong'
            })
            .finally(() => loading.value = false)
    };

    // const toggleFav = async (taskId:any) => {
    //     const favTask = tasks.value.find((t:Task)=> t.id === taskId)
    //     favTask.isFav =!favTask.isFav

    //     // const res = axios
    //     //     .post('http://localhost:3000/tasks/'+ id,{isFav: favTask.isFav})
    //     //     .then(response => {
    //     //         // console.log(response.data)
    //     //     })
    //     //     .catch(error => {
    //     //         console.log(error)
    //     //         // this.errored = true
    //     //     })
    //     //     .finally(() => this.loading = false)


    //     console.log(taskId)
    // }

    // const isFav = () => {
    //     return tasks.value.filter((t: any) => t.isFav);
    //   };

    // const favCount = () => {
    //     return tasks.value.reduce((p: any, c: any) => {
    //       return c.isFav ? p + 1 : p;
    //     }, 0);
    //   };
      
    const totalCount = computed(() => tasks.value?.length ?? 0);

    return ({
        tasks, 
        loading, 
        error, 
        getTasks, 
        addTask, 
        deleteTask, 
        loadTaskDetails, 
        addSubTask, 
        deleteSubTask,
        // isFav,
        // toggleFav,
        // favCount,
        totalCount

    })
})