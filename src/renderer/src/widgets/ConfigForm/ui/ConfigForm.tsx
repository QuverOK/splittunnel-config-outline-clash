'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import type { ReactElement } from 'react'
import * as z from 'zod'
import { useState } from 'react'

import { Button } from '@renderer/shared/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@renderer/shared/ui/form'
import { Input } from '@renderer/shared/ui/input'
import { Textarea } from '@renderer/shared/ui/textarea'
import { Label } from '@renderer/shared/ui/label'

const formSchema = z.object({
  ssLink: z.string().min(1, {
    message: 'Поле не должно быть пустым'
  }),
  exeList: z.string().min(1, {
    message: 'Поле не должно быть пустым'
  })
})

export const ConfigForm = (): ReactElement => {
  const [status, setStatus] = useState<{
    success?: boolean
    message?: string
  } | null>(null)
  const [outputPath, setOutputPath] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ssLink: '',
      exeList: ''
    }
  })

  const handleSelectFolder = async (): Promise<void> => {
    const selectedPath = await window.api.selectFolder()
    if (selectedPath) {
      setOutputPath(selectedPath)
    }
  }

  const onSubmit = async (values: z.infer<typeof formSchema>): Promise<void> => {
    setStatus(null)
    const result = await window.api.generateConfig(values.ssLink, values.exeList, outputPath)
    setStatus(result)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="ssLink"
          render={({ field }): ReactElement => (
            <FormItem>
              <FormLabel>SS Link</FormLabel>
              <FormControl>
                <Input placeholder="ss://..." {...field} />
              </FormControl>
              <FormDescription>Вставьте вашу ss:// ссылку</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="exeList"
          render={({ field }): ReactElement => (
            <FormItem>
              <FormLabel>Список EXE файлов</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="telegram.exe, discord.exe"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Укажите исполняемые файлы через запятую или каждый с новой строки
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-2">
          <Label>Папка для сохранения</Label>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" onClick={handleSelectFolder}>
              Выбрать...
            </Button>
            <p className="text-sm text-muted-foreground truncate">
              {outputPath || 'По умолчанию: папка output в каталоге приложения'}
            </p>
          </div>
        </div>
        <Button type="submit">Сгенерировать</Button>
      </form>
      {status && (
        <p className={`mt-4 text-sm ${status.success ? 'text-green-500' : 'text-red-500'}`}>
          {status.message}
        </p>
      )}
    </Form>
  )
}
