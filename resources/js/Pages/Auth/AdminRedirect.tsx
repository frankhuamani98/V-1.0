import { router } from '@inertiajs/react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/Components/ui/dialog';
import { Button } from '@/Components/ui/button';

interface AdminRedirectProps {
    user: {
        first_name: string;
    };
}

export default function AdminRedirect({ user }: AdminRedirectProps) {
    const [isOpen, setIsOpen] = useState<boolean>(true);

    const goToDashboard = () => {
        setIsOpen(false);
        router.visit('/dashboard', {
            onFinish: () => setIsOpen(false),
        });
    };

    const goToHome = () => {
        setIsOpen(false);
        router.visit('/', {
            onFinish: () => setIsOpen(false),
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Redirección de Administrador</DialogTitle>
                    <DialogDescription>
                        Hola {user.first_name}, ¿deseas ir al Dashboard o a la página principal?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button onClick={goToDashboard}>Ir al Dashboard</Button>
                    <Button variant="secondary" onClick={goToHome}>Ir a la página principal</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}