<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    $b = \App\Models\Booking::with(['event', 'user', 'teaOrders.teaItem'])->find(6);
    if (!$b) {
        $b = \App\Models\Booking::with(['event', 'user', 'teaOrders.teaItem'])->first();
    }
    $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('invoices.pdf', ['booking' => $b]);
    echo "PDF generated successfully, size: " . strlen($pdf->output()) . " bytes\n";
} catch (\Throwable $e) {
    echo "ERROR: " . $e->getMessage() . "\n" . $e->getTraceAsString() . "\n";
}
