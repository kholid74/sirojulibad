import test from 'node:test';
import assert from 'node:assert/strict';
import { projectMetadata, validateSlugs, categoryMetadata, validateProjectCategories } from '../src/lib/project-schema.mjs';
import profile, { profileSchema } from '../src/data/profile.ts';
import { filterProjects } from '../src/scripts/filter.ts';
const valid = { title:'A project', slug:'a-project', category:'Web Design', summary:'A summary', coverAlt:'A website preview' };
test('editor inputs reject unsafe links, malformed slugs, and empty categories', () => {
  for (const patch of [{website:'javascript:alert(1)'},{behance:'data:text/html,test'},{slug:'../test'},{category:''},{coverAlt:''}]) assert.equal(projectMetadata.safeParse({...valid,...patch}).success,false);
  const parsed=projectMetadata.parse({...valid,website:'',behance:null,featuredOrder:null,role:''});
  assert.equal(parsed.website,undefined);
  assert.equal(parsed.featuredOrder,undefined);
  assert.equal(parsed.role,undefined);
  assert.equal(parsed.status,'draft');
  assert.equal(projectMetadata.parse({...valid,website:'https://example.com'}).website,'https://example.com');
});
test('duplicate slugs fail even across drafts and published projects', () => {
  assert.throws(()=>validateSlugs([{data:valid},{data:{...valid,status:'draft'}}]),/Duplicate project slug/);
});
test('category filtering updates visibility and can return to all work', () => {
  const cards=['Web Design','Mobile Design','Web Design'].map(category=>({dataset:{category},hidden:false}));
  assert.equal(filterProjects(cards,'Mobile Design'),1);
  assert.deepEqual(cards.map(c=>c.hidden),[true,false,true]);
  assert.equal(filterProjects(cards,'All'),3);
  assert.equal(cards.every(c=>!c.hidden),true);
  assert.equal(filterProjects(cards,'Games'),0);
});

test('profile rejects invalid contact addresses and unsafe social URLs', () => {
  const valid = profile;
  assert.equal(profileSchema.safeParse({...valid,email:"invalid"}).success,false);
  assert.equal(profileSchema.safeParse({...valid,linkedin:"javascript:alert(1)"}).success,false);
});

test('new CMS categories are accepted for projects and filtering', () => {
  const categories = ['Web Design', 'Motion Design'].map(name => ({ data: categoryMetadata.parse({ name }) }));
  const custom = projectMetadata.parse({ ...valid, category: 'Motion Design' });
  assert.doesNotThrow(() => validateProjectCategories([{ data: custom }], categories));
  const cards = [{ dataset: { category: custom.category }, hidden: true }, { dataset: { category: 'Web Design' }, hidden: false }];
  assert.equal(filterProjects(cards, 'Motion Design'), 1);
  assert.deepEqual(cards.map(card => card.hidden), [false, true]);
  assert.equal(filterProjects(cards, 'All'), 2);
});

test('category catalog rejects blank/reserved names and invalid ordering', () => {
  for (const name of ['', '   ', 'All', 'all', ' ALL ']) assert.equal(categoryMetadata.safeParse({ name }).success, false);
  assert.equal(categoryMetadata.safeParse({ name: 'Motion Design', order: -1 }).success, false);
  assert.equal(categoryMetadata.parse({ name: ' Motion Design ', order: null }).name, 'Motion Design');
  assert.equal(categoryMetadata.parse({ name: 'Motion Design', order: '' }).order, 100);
});

test('category catalog rejects duplicate names regardless of case', () => {
  const categories = ['Motion Design', 'motion design'].map(name => ({ data: categoryMetadata.parse({ name }) }));
  assert.throws(() => validateProjectCategories([], categories), /Duplicate portfolio category/);
});

test('missing or removed categories fail for published and draft projects', () => {
  const categories = [{ data: categoryMetadata.parse({ name: 'Web Design' }) }];
  for (const status of ['published', 'draft']) {
    assert.throws(() => validateProjectCategories([{ data: { ...valid, category: 'Removed category', status } }], categories), /Unknown portfolio category.*Removed category.*a-project/);
  }
});
