export default function Footer({isDark}){
    return (
        <>
        <footer className="p-2 mt-4">
            <h1 className={isDark ? "text-sm text-white text-center pt-8 border-t mb-4":"text-sm text-center pt-8 border-t mb-4"}>© 2024 Made by Berktug Berke Ates</h1>
        </footer>
        </>
    )
}