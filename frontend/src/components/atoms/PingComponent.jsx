import usePing from "../../hooks/apis/queries/usePing";

export const PingComponent = () => { // Updated to start with uppercase
    const { isLoading, data } = usePing();

    if (isLoading) {
        return (
            <>
                Loading...
            </>
        );
    }

    return (
        <>
            Hello {data?.message} {/* Safely access data to avoid errors if `data` is undefined */}
        </>
    );
};
