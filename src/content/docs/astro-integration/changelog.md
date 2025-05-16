
# direct access to /prefix

For i18n, we want to mitigate the risk against serving content on / and /en-gb. In 1.x.x we explicitly detected that a request is made without a header to /en-gb and 404d. In 2.x.x we rewrite all requests, and let the application middleware decide whether there's a matching path at `[locale]/[prefix]`

Before: example request pattern 


```
www.example.com => rewrite => www.example.com/en-gb/
www.example.com/en-gb/ => www.example.com/en-gb (404)
```



After: 

```
www.example.com => rewrite => www.example.com/en-gb/
www.example.com/en-gb/ => www.example.com/en-gb/en-gb  (404)
```