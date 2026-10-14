import test from 'node:test';
import assert from 'node:assert/strict';
import { projectMetadata, validateSlugs } from '../src/lib/project-schema.mjs';
import profile, { profileSchema } from '../src/data/profile.ts';
import { filterProjects } from '../src/scripts/filter.ts';
const valid = { title:'A project', slug:'a-project', category:'Web Design', summary:'A summary', coverAlt:'A website preview' };
test('editor inputs reject unsafe links, malformed slugs, and unknown categories', () => {
  for (const patch of [{website:'javascript:alert(1)'},{behance:'data:text/html,test'},{slug:'../test'},{category:'Unknown'},{coverAlt:''}]) assert.equal(projectMetadata.safeParse({...valid,...patch}).success,false);
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
