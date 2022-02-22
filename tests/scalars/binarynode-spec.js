import { parse } from '../../parser/node_parse.js'

describe("Lidy scalars ->", function() {

    describe("binary scalar : ", function() {
        
        it("no padding",
            function() { expect( parse({src_data: "aGVsbG8sIHdvcmxk", dsl_data: "main: binary"}).result().value).toEqual("aGVsbG8sIHdvcmxk")})

        it("padding",
            function() { expect( parse({src_data: "aGVsbG8sIHdvcmxkLg==", dsl_data: "main: binary"}).result().value).toEqual("aGVsbG8sIHdvcmxkLg==")})

        it("every string is not a base64 encoded binary",
            function() { expect( parse({src_data: "aGVsbG8s{IHdvcmxkLg", dsl_data: "main: binary"}).fails()).toEqual(true)})

        it("every string is not a base64 encoded binary 2",
            function() { expect( parse({src_data: "aG=VsbG8s{IHdvcmxkLg", dsl_data: "main: binary"}).fails()).toEqual(true)})

    })
})
