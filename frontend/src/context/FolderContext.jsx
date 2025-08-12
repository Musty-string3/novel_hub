import { createContext, useContext, useReducer } from 'react'

const FolderContext = createContext();
const FolderUpdateContext = createContext();


const initialState = [];

const folderReducer = (state, {type, payload}) => {
    console.log(payload);
    switch (type) {
        case "folders/list": {
            return payload;
        }
        case "folders/upsert": {
            return state;
        }
        default: {
            return state;
        }
    }
};

const FolderProvider = ({children}) => {
    const [folder, folderDispatch] = useReducer(folderReducer, initialState);

    return(
        <FolderContext.Provider value={folder}>
            <FolderUpdateContext.Provider value={folderDispatch}>
                {children}
            </FolderUpdateContext.Provider>
        </FolderContext.Provider>
    );
}

export const useFolder = () => {
    return useContext(FolderContext);
}

export const useUpdateFolder = () => {
    return useContext(FolderUpdateContext);
}


export default FolderProvider