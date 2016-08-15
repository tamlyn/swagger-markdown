Swagger Sample API
==================
A sample API that uses a petstore as an example to demonstrate features in the swagger-2.0 specification

**Version** 1.0.9-abcd
### /pets/{id}
---
##### ***GET***
**Summary:** Find pets by ID

**Description:** Returns pets based on ID

**Parameters**

| Name | Located in | Description | Required | Type |
| ---- | ---------- | ----------- | -------- | ---- |
| id | path | ID of pet to use | Yes | array |
**Responses**

| Code | Description |
| ---- | ----------- |
| 200 | pet response |
| default | error payload |