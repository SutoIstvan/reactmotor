<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class PageContentImageTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_cannot_upload_images(): void
    {
        $file = UploadedFile::fake()->image('about-photo.jpg');

        $response = $this->postJson(route('admin.upload-image'), [
            'image' => $file,
        ]);

        $response->assertUnauthorized();
    }

    public function test_authenticated_user_can_upload_image(): void
    {
        Storage::fake('public');

        $user = User::factory()->create();
        $this->actingAs($user);

        $file = UploadedFile::fake()->image('custom-photo.jpg', 800, 600);

        $response = $this->postJson(route('admin.upload-image'), [
            'image' => $file,
        ]);

        $response->assertOk()
            ->assertJsonStructure(['url', 'message']);

        $url = $response->json('url');
        $this->assertStringStartsWith('/storage/page-content/', $url);

        $filename = basename($url);
        Storage::disk('public')->assertExists('page-content/'.$filename);
    }

    public function test_image_upload_validation_rejects_non_image_files(): void
    {
        Storage::fake('public');

        $user = User::factory()->create();
        $this->actingAs($user);

        $file = UploadedFile::fake()->create('document.pdf', 100, 'application/pdf');

        $response = $this->postJson(route('admin.upload-image'), [
            'image' => $file,
        ]);

        $response->assertUnprocessable();
    }

    public function test_user_can_save_and_display_custom_about_images(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $customUrl1 = '/storage/page-content/photo1.jpg';
        $customUrl2 = '/storage/page-content/photo2.jpg';
        $customUrl3 = '/storage/page-content/photo3.jpg';

        $response = $this->put(route('admin.pages.update', ['page' => 'home']), [
            'sections' => [
                'about' => [
                    'photo_1' => $customUrl1,
                    'photo_2' => $customUrl2,
                    'photo_3' => $customUrl3,
                    'title' => 'Teszt Rólunk Cím',
                ],
            ],
        ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('page_contents', [
            'page' => 'home',
            'section' => 'about',
        ]);

        $homeResponse = $this->get(route('home'));
        $homeResponse->assertOk();
        $homeResponse->assertSee($customUrl1);
        $homeResponse->assertSee($customUrl2);
        $homeResponse->assertSee($customUrl3);
    }
}
