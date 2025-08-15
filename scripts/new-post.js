/* This is a script to create a new post markdown file with front-matter */

import fs from "fs"
import path from "path"

function getDate() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, "0")
  const day = String(today.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

const args = process.argv.slice(2)

if (args.length === 0) {
  console.error(`Error: No filename argument provided
Usage: pnpm new-post <filename>`)
  process.exit(1) // Terminate the script and return error code 1
}

const targetDir = "./src/content/posts/"

// Find the highest existing post number
let maxNumber = 0
const files = fs.readdirSync(targetDir)
for (const file of files) {
  const match = file.match(/^(\d{2,4})-/) // Matches 2 to 4 digits at the beginning
  if (match) {
    const number = parseInt(match[1], 10)
    if (!isNaN(number) && number > maxNumber) {
      maxNumber = number
    }
  }
}

const nextNumber = maxNumber + 1
const formattedNumber = String(nextNumber).padStart(4, "0")

let fileName = `${formattedNumber}-${args[0]}`

// Add .md extension if not present
const fileExtensionRegex = /\.(md|mdx)$/i
if (!fileExtensionRegex.test(fileName)) {
  fileName += ".md"
}

const fullPath = path.join(targetDir, fileName)

if (fs.existsSync(fullPath)) {
  console.error(`Error: File ${fullPath} already exists `)
  process.exit(1)
}

// recursive mode creates multi-level directories
const dirPath = path.dirname(fullPath)
if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
}

const content = `---
title: ${args[0]}
published: ${getDate()}
description: ''
image: ''
tags: []
category: ''
draft: false 
lang: ''
---
`

fs.writeFileSync(path.join(targetDir, fileName), content)

console.log(`Post ${fullPath} created`)
