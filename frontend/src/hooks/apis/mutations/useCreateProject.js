import { useMutation } from "@tanstack/react-query"
import { createProjectApi } from "../../../apis/projects"

export const useCreateProject = () => {
    const { mutateAsync, isPending, isSuccess, error } = useMutation({
        mutationFn: createProjectApi,
        onSuccess: (data) => {
            console.log("Project create successfully", data);
            
        },
        onError: () => {
            console.log("Error in creating project");
        }
    });
    return {
        createProjectMutation: mutateAsync,
        isPending,
        isSuccess,
        error
    }
}