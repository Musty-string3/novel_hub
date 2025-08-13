import { Button, Stack, Input, Fieldset, Field, Textarea, parseColor, ColorPicker, Portal, HStack, Switch } from "@chakra-ui/react"
import { useState } from "react";


const FolderDetailCreate = ({createNovel}) => {
    const [ title, setTitle ] = useState("");
    const [ description, setDescription ] = useState("");
    const [ showSpeaker, setShowSpeaker ] = useState(true);
    const [ isPublic, setIsPublic ] = useState(true);
    const [ backgroundColor, setBackgroundColor ] = useState("#ffffff");

    return (
        <div>
            <Fieldset.Root size="lg" maxW="md">
                <Stack>
                    <Fieldset.Legend>ここは小説の作成画面です。</Fieldset.Legend>
                    <Fieldset.HelperText>
                        下からモーダルが出てきて遷移できるようにしたいね
                    </Fieldset.HelperText>
                </Stack>

                <Fieldset.Content>
                    <Field.Root>
                        <Field.Label>タイトル</Field.Label>
                        <Input
                            type="text"
                            placeholder="タイトル名を入力"
                            value={title}
                            required
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </Field.Root>

                    <Field.Root>
                        <Field.Label>説明</Field.Label>
                        <Textarea
                            placeholder="説明を入力"
                            value={description}
                            height="200px"
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </Field.Root>

                    <Field.Root>
                        <ColorPicker.Root
                            defaultValue={parseColor(backgroundColor)}
                            onChange={(e) => {setBackgroundColor(e.target.value)}}
                            maxW="200px"
                        >
                            <ColorPicker.HiddenInput />
                            <ColorPicker.Label>背景色</ColorPicker.Label>
                            <ColorPicker.Control>
                                <ColorPicker.Input />
                                <ColorPicker.Trigger />
                            </ColorPicker.Control>
                            <Portal>
                                <ColorPicker.Positioner>
                                <ColorPicker.Content>
                                    <ColorPicker.Area />
                                    <HStack>
                                    <ColorPicker.EyeDropper size="xs" variant="outline" />
                                    <ColorPicker.Sliders />
                                    </HStack>
                                </ColorPicker.Content>
                                </ColorPicker.Positioner>
                            </Portal>
                        </ColorPicker.Root>
                    </Field.Root>

                    <Field.Root>
                        <Switch.Root
                            checked={isPublic}
                            onCheckedChange={() => setIsPublic((prev) => !prev)}
                            colorPalette="teal"
                        >
                            <Switch.HiddenInput />
                            <Switch.Control />
                            <Switch.Label>公開設定</Switch.Label>
                        </Switch.Root>
                    </Field.Root>

                    <Field.Root>
                        <Switch.Root
                            checked={showSpeaker}
                            onCheckedChange={() => setShowSpeaker((prev) => !prev)}
                            colorPalette="teal"
                        >
                            <Switch.HiddenInput />
                            <Switch.Control />
                            <Switch.Label>キャラクター名表示有無</Switch.Label>
                        </Switch.Root>
                    </Field.Root>

                </Fieldset.Content>

                <Button
                    type="submit"
                    onClick={() => createNovel(
                        title,
                        description,
                        isPublic,
                        showSpeaker,
                        backgroundColor
                    )}
                    disabled={!title.length}
                    colorPalette="teal"
                >
                    Submit
                </Button>
            </Fieldset.Root>
        </div>
    )
}

export default FolderDetailCreate
