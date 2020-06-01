import { jsx, Fragment, css } from '../../mod.ts';

export async function Hello() {
    const color = 'blue';
    return (
        <Fragment>
            {await css('./hello.css', { var: { color }})}
            <p class="hello">Hello world</p>
        </Fragment>
    );
}
