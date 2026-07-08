<?php
require __DIR__ . '/vendor/autoload.php';
$app = require __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "Users:\n";
foreach (App\Models\User::all() as $u) {
    echo "id={$u->id} name={$u->name} role={$u->role}\n";
}
echo "\nEvents:\n";
foreach (App\Models\Event::all() as $e) {
    echo "id={$e->id} title={$e->title} status={$e->status}\n";
}
echo "\nBookings:\n";
foreach (App\Models\Booking::all() as $b) {
    echo "id={$b->id} user_id={$b->user_id} event_id={$b->event_id} name={$b->name}\n";
}
