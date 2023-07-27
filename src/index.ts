import { Geddit } from "./utils/geddit";

async function test() {
    const geddit: Geddit = new Geddit()
    const posts = await geddit.getSubmissions()

    console.log(posts)
}
    
test()