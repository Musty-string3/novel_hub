import { Button, Stack, Input } from "@chakra-ui/react"


const FolderCreate = ({newFolder, setNewFolder, createFolder}) => {

    return (
        <div>
            <h2>ここはフォルダの作成画面です。</h2>
            <Stack gap="2" align="flex-start">
                <Stack align="center" direction="row" gap="10">
                    <Input
                        type="text"
                        placeholder="フォルダ名を入力"
                        value={newFolder}
                        required
                        onChange={(e) => setNewFolder(e.target.value)}
                    />
                    <Button
                        type="button"
                        onClick={() => createFolder()}
                        disabled={!newFolder.length}
                        colorPalette="teal"
                    >作成
                    </Button>
                </Stack>
            </Stack>
        </div>
    )
}

export default FolderCreate
