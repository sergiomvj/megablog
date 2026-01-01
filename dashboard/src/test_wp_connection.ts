import { WordPressService } from './services/wordpress.service';

async function test() {
    console.log("Testing connection to WordPress...");
    const result = await WordPressService.checkConnection();

    if (result.success) {
        console.log("✅ Success!");
        console.log(result.message);
    } else {
        console.log("❌ Failed!");
        console.log(result.message);
    }
}

test();
